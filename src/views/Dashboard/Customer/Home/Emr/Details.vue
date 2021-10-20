<template lang="pug">
  .customer-emr-details
    .customer-emr-details__wrapper
      .customer-emr-details__emr
        .customer-emr-details__emr-title List of TBC Documents
        .customer-emr-details__emr-documents
          .customer-emr-details__document.customer-emr-details__document--active(role="button")
            ui-debio-icon.customer-emr-details__document-icon(
              :icon="fileTextIcon"
              size="28"
              color="#D3C9D1"
              fill
            )
            .customer-emr-details__document-title Treatment
          .customer-emr-details__document(role="button")
            ui-debio-icon.customer-emr-details__document-icon(
              :icon="fileTextIcon"
              size="28"
              color="#D3C9D1"
              fill
            )
            .customer-emr-details__document-title Diagnose
          .customer-emr-details__document(role="button")
            ui-debio-icon.customer-emr-details__document-icon(
              :icon="fileTextIcon"
              size="28"
              color="#D3C9D1"
              fill
            )
            .customer-emr-details__document-title Medical Receipt Diagnose Treatment
      .customer-emr-details__viewer
        .customer-emr-details__viewer-wrapper
          embed.customer-emr-details__viewer-content(src="http://pii.or.id/uploads/dummies.pdf#view=fitH" type="application/pdf")
</template>

<script>
import { fileTextIcon } from "@/common/icons"

export default {
  name: "CustomerEmrDetails",

  data: () => ({
    fileTextIcon
  })
}
</script>

<style lang="sass">
  @import "@/common/styles/mixins.sass"
  .customer-emr-details
    padding: 80px 35px
    background: #ffffff
    border-radius: 4px

    &__wrapper
      display: flex
      gap: 35px

    &__emr
      width: 255px

    &__emr-title
      @include body-text-medium-2
    
    &__emr-documents
      display: flex
      flex-direction: column
      gap: 10px
      margin-top: 20px

    &__document
      display: flex
      align-items: center
      gap: 20px
      padding: 18px 20px
      border: 1px solid #E9E9E9
      border-radius: 4px
      transition: all cubic-bezier(.7, -0.04, .61, 1.14) .3s

      &:hover
        background: #F9F9F9
        border: 1px solid #6F4CEC

      &--active
        background: #F9F9F9
        border: 1px solid #6F4CEC

    &__document-title
      max-width: 165px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      -webkit-touch-callout: none
      -khtml-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      @include body-text-2
    
    &__viewer
      width: 100%

    &__viewer-wrapper
      padding: 22px
      background: #F5F7F9
      border-radius: 4px

    &__viewer-content
      width: 100%
      min-height: 700px
      border-radius: 4px
</style>
