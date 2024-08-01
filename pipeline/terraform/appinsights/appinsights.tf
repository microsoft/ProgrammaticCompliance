resource "azurerm_log_analytics_workspace" "workspace" {
  name                  = var.workspace_name
  location              = var.appinsights_location
  resource_group_name   = var.appinsights_rg_name
}

resource "azurerm_application_insights" "appinsights" {
  name                  = var.appinsights_name
  location              = azurerm_log_analytics_workspace.workspace.location
  resource_group_name   = azurerm_log_analytics_workspace.workspace.resource_group_name
  workspace_id          = azurerm_log_analytics_workspace.workspace.id
  application_type      = "web"
}