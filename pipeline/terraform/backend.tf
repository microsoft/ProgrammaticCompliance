terraform {
  backend "azurerm" {
    resource_group_name = "complianceterfrontend_rg"
    storage_account_name = "complianceterfrontendsa"
    container_name = "terraform-state"
    key = "terraform.tfstate"
  }
}