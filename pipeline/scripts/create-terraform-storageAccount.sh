#!/bin/bash

STORAGE_ACCOUNT_NAME=$1
RESOURCE_GROUP_NAME=$2
RESOURCE_GROUP_LOCATION=$3
TERRAFORM_CONTAINER_NAME=$4

function ExitIfFailed {
	if [ "$1" != 0 ]; then
		echo " $2! Exiting with error" >&2
		exit 1
	fi
}

echo "=== Creating of retrieving terraform backend resource group ==="
RG_EXISTS=$(az group exists -n "${RESOURCE_GROUP_NAME}")
if [ "${RG_EXISTS}" = "true" ]; then
	echo "Terraform resource group ${RESOURCE_GROUP_NAME} already exists. Skipping creation"
else
	az group create -l "${RESOURCE_GROUP_LOCATION}" -n "${RESOURCE_GROUP_NAME}"
	ExitIfFailed $? "Creation of ${RESOURCE_GROUP_NAME} failed"
	echo "Resource group ${RESOURCE_GROUP_NAME} created"
fi

echo "=== Creating the terraform backend storage account ==="
echo "Checking if the storage account name is available to use"
STORAGE_ACCOUNT_NAME_AVAILABLE=$(az storage account check-name -n "${STORAGE_ACCOUNT_NAME}" --query "nameAvailable" -o tsv)
if [ "${STORAGE_ACCOUNT_NAME_AVAILABLE}" = "false" ]; then
	echo "Checking if the storage account already exists in the terraform resource group"
	az storage account show -g "${RESOURCE_GROUP_NAME}" -n "${STORAGE_ACCOUNT_NAME}"
	ExitIfFailed $? "The storage account ${STORAGE_ACCOUNT_NAME} does not exist in the ${RESOURCE_GROUP_NAME}"
	echo "The storage account ${STORAGE_ACCOUNT_NAME} exists and can be used for the terraform backend"
else
	echo "The storage account ${STORAGE_ACCOUNT_NAME} does not exist. Creating..."
	az storage account create \
		-n "${STORAGE_ACCOUNT_NAME}" \
		-g "${RESOURCE_GROUP_NAME}" \
		-l "${RESOURCE_GROUP_LOCATION}" \
		--sku "Standard_LRS"

	ExitIfFailed $? "The creation of the storage account ${STORAGE_ACCOUNT_NAME} failed"
	echo "Storage account ${STORAGE_ACCOUNT_NAME} successfully created."
fi

echo "=== Retrieving the key to write to the container ${TERRAFORM_CONTAINER_NAME} ==="
AZURE_STORAGE_KEY=$(az storage account keys list --account-name "${STORAGE_ACCOUNT_NAME}" --query "[?keyName=='key1'].value" -o tsv)
ExitIfFailed $? "Cannot retrieve the storage account ${STORAGE_ACCOUNT_NAME} key"

echo "=== Checking if the container ${TERRAFORM_CONTAINER_NAME} exists ==="
export AZURE_STORAGE_KEY
CONTAINER_EXISTS=$(az storage container exists --name "${TERRAFORM_CONTAINER_NAME}" --account-name "${STORAGE_ACCOUNT_NAME}" --auth-mode key --query exists -o tsv)
if [ "${CONTAINER_EXISTS}" = "false" ]; then
    echo "=== Creating the blob container ${TERRAFORM_CONTAINER_NAME} ==="
	az storage container create \
	  --account-name "${STORAGE_ACCOUNT_NAME}" \
	  --name "${TERRAFORM_CONTAINER_NAME}" \
	  --auth-mode key \
	  --public-access off
    ExitIfFailed $? "The creation of the storage container ${TERRAFORM_CONTAINER_NAME} failed"
else
    echo "The storage account container ${TERRAFORM_CONTAINER_NAME} exists"
fi

echo "ARM_ACCESS_KEY=${AZURE_STORAGE_KEY}" >> $GITHUB_ENV
echo "=== Setup of the terraform backend complete ==="