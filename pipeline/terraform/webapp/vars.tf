variable "service_plan_name" {
  type      = string
  default   = "fecomplianceAppServicePlan"
}

variable "app_resource_group_name" {
  type = string
}

variable "app_location" {
  type = string
}

variable "worker_count" {
  type      = number
  default   = 2
}

variable "web_app_name" {
  type      = string
  default   = "progcompliancefe"
}

variable "appinsights_connection_string" {
  type = string
}

variable "health_check_path" {
    type = string
}

variable "health_check_eviction_time_in_min" {
    type = string
}
