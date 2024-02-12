resource "azurerm_service_plan" "sp" {
  name                  = var.service_plan_name
  resource_group_name   = var.app_resource_group_name
  location              = var.app_location
  os_type               = "Linux"
  sku_name             = "P1v3"
  worker_count          = var.worker_count
}

resource "azurerm_linux_web_app" "webapp" {
  name                                              = var.web_app_name
  resource_group_name                               = var.app_resource_group_name
  location                                          = var.app_location
  service_plan_id                                   = azurerm_service_plan.sp.id
  public_network_access_enabled                     = true
  https_only                                        = "true"
  logs {
    application_logs {
      file_system_level = "Information"
    }
    http_logs {
      file_system {
        retention_in_days   = 5
        retention_in_mb     = 100
      }
    }
  }
  site_config {
    application_stack {
      node_version                                  = "18-lts"
    }
    ftps_state                                      = "FtpsOnly"
    health_check_path                               = var.health_check_path
    health_check_eviction_time_in_min               = var.health_check_eviction_time_in_min
  }
  app_settings = {
    "APPLICATIONINSIGHTS_CONNECTION_STRING"         = var.appinsights_connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION"    = "~3"
    "XDT_MicrosoftApplicationInsights_Mode"         = "Recommended"
    "WEBSITE_RUN_FROM_PACKAGE"                      = "1"
    "WEBSITE_WEBDEPLOY_USE_SCM"                     = "true"
  }
}