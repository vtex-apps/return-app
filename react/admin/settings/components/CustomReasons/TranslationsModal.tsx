import type { ChangeEvent, ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import type { Tenant, Binding } from 'vtex.tenant-graphql'
import { ModalDialog, Table, Input, Spinner, EmptyState } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import type { CustomReturnReasonTranslation } from '../../../../../typings/ReturnAppSettings'
import TENANT_INFO from './graphql/tenant.gql'
import type { CustomReasonWithIndex } from './CustomReasons'
import { useSettings } from '../../hooks/useSettings'

const localesAvailable = (bindings: Binding[]): string[] => {
  const storefrontBindings = bindings.filter(
    (binding) => binding.targetProduct === 'vtex-storefront'
  )

  const localesMap = new Map()

  for (const binding of storefrontBindings) {
    const { defaultLocale, supportedLocales } = binding

    if (!localesMap.has(defaultLocale)) {
      localesMap.set(defaultLocale, true)
    }

    for (const locale of supportedLocales) {
      if (locale && !localesMap.has(locale)) {
        localesMap.set(locale, true)
      }
    }
  }

  return Array.from(localesMap.keys())
}

const createTranslationOptions = (
  availableLocales: string[],
  translation?: CustomReturnReasonTranslation[] | null
): CustomReturnReasonTranslation[] => {
  return availableLocales.map((availableLocale) => {
    const currentTranslation = translation?.find(
      ({ locale }) => locale === availableLocale
    )

    return currentTranslation ?? { locale: availableLocale, translation: '' }
  })
}

const tableSchema = (
  handleTranslationInput: (e: ChangeEvent<HTMLInputElement>) => void
) => ({
  properties: {
    locale: {
      title: (
        <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.table.header.custom-reason-translation.locale" />
      ),
    },
    translation: {
      title: (
        <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.table.header.custom-reason-translation.translation" />
      ),
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        rowData,
      }: {
        rowData: CustomReturnReasonTranslation
      }) => {
        const { translation, locale } = rowData

        return (
          <Input
            size="small"
            value={translation}
            name={locale}
            onChange={handleTranslationInput}
          />
        )
      },
    },
  },
})

interface TranslationsModalProps {
  isOpen: boolean
  onClose: () => void
  customReasonOnFocus: CustomReasonWithIndex | null
}

export const TranslationsModal = ({
  customReasonOnFocus,
  isOpen,
  onClose,
}: TranslationsModalProps) => {
  const [tempTranslations, setTempTranslations] = useState<
    CustomReturnReasonTranslation[]
  >([])

  const { appSettings, actions } = useSettings()

  const { customReturnReasons } = appSettings || {}
  const { dispatch } = actions || {}

  const { data, loading, error } = useQuery<{ tenantInfo: Tenant }>(TENANT_INFO)

  useEffect(() => {
    if (customReasonOnFocus?.translations) {
      setTempTranslations(customReasonOnFocus.translations)
    }
  }, [customReasonOnFocus])

  const handleTranslationInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    const hasLocale = tempTranslations.find(
      (translation) => translation.locale === name
    )

    if (hasLocale) {
      const newTranslations = tempTranslations.map((translation) => {
        if (translation.locale === name) {
          return { ...translation, translation: value }
        }

        return translation
      })

      setTempTranslations(newTranslations)

      return
    }

    const newTranslations = [
      ...tempTranslations,
      { locale: name, translation: value },
    ]

    setTempTranslations(newTranslations)
  }

  const handleCloseModal = () => {
    setTempTranslations([])
    onClose()
  }

  const handleConfirmation = () => {
    const updatedCustomReturnReasons = customReturnReasons?.map(
      (customReason, i) => {
        if (i === customReasonOnFocus?.index) {
          // filters our the ones where the translation is empty to avoid rendering an empty string to final user
          const translations = tempTranslations.filter(({ translation }) =>
            Boolean(translation)
          )

          return {
            ...customReason,
            translations,
          }
        }

        return customReason
      }
    )

    if (updatedCustomReturnReasons) {
      dispatch({
        type: 'updateCustomReturnReasons',
        payload: updatedCustomReturnReasons,
      })
    }

    handleCloseModal()
  }

  const availableLocales = localesAvailable(data?.tenantInfo?.bindings ?? [])

  return (
    <ModalDialog
      centered
      isOpen={isOpen}
      onClose={handleCloseModal}
      confirmation={{
        label: (
          <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.confirm" />
        ),
        onClick: handleConfirmation,
      }}
      cancelation={{
        label: (
          <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.cancel" />
        ),
        onClick: handleCloseModal,
      }}
    >
      <div>
        <div>
          <h4 className="f3 fw3 gray mt6 mb2">
            <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.header.custom-reason-translation" />
          </h4>
          <p>
            <FormattedMessage
              id="admin/return-app.settings.section.custom-reasons.modal.translations.sub-header.custom-reason-translation"
              values={{
                reason: customReasonOnFocus?.reason,
                // eslint-disable-next-line react/display-name
                b: (chunks: ReactElement) => <b>{chunks}</b>,
              }}
            />
          </p>
        </div>
        {error ? (
          <EmptyState
            title={
              <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.error.header" />
            }
          >
            <p>
              <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.translations.error.description" />
            </p>
          </EmptyState>
        ) : loading ? (
          <Spinner />
        ) : (
          <div>
            <Table
              schema={tableSchema(handleTranslationInput)}
              items={createTranslationOptions(
                availableLocales,
                tempTranslations
              )}
              fullWidth
            />
          </div>
        )}
      </div>
    </ModalDialog>
  )
}
