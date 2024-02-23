terraform {
  required_providers {
    azurerm = {
        source  = "hashicorp/azurerm"
        version = "=3.81.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

data "azurerm_subscription" "sub" {
  
}

resource "azurerm_resource_group" "rg" {
  name      = var.resource_group_name
  location  = var.location
}

module "appinsights" {
    source                  = "./appinsights"
    appinsights_location    = azurerm_resource_group.rg.location
    appinsights_rg_name     = azurerm_resource_group.rg.name
}

module "webapp" {
  source                            = "./webapp"
  web_app_name                      = var.azure_app_name
  app_resource_group_name           = module.appinsights.appinsights_rg_name
  app_location                      = module.appinsights.appinsights_location
  appinsights_connection_string     = module.appinsights.appinsights_connection_string
  health_check_path                 = "/"
  health_check_eviction_time_in_min = 5
}

resource "azurerm_role_definition" "policyreader" {
  name          = "Policy resources reader"
  scope         = data.azurerm_subscription.sub.id
  description   = "Custom role to read policy definitions, initiatives and policy metadata resources"
  permissions {
    actions     = [ 
      "Microsoft.Authorization/policyDefinitions/read",
      "Microsoft.Authorization/policySetDefinitions/read",
      "Microsoft.PolicyInsights/policyMetadata/read"
    ]
    not_actions = []
  }
  assignable_scopes = [ data.azurerm_subscription.sub.id ]
}

resource "azurerm_role_assignment" "policyreaderrole" {
  scope               = data.azurerm_subscription.sub.id
  role_definition_id  = azurerm_role_definition.policyreader.role_definition_resource_id
  principal_id        = module.webapp.webapp_principal_id
}


