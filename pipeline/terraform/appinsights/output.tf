output "appinsights_connection_string" {
  value = azurerm_application_insights.appinsights.connection_string
}

output "appinsights_location" {
    value = azurerm_application_insights.appinsights.location
}

output "appinsights_rg_name" {
    value = azurerm_application_insights.appinsights.resource_group_name
}