output "webapp_principal_id" {
  value = azurerm_linux_web_app.webapp.identity.0.principal_id
}