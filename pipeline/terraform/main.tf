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