import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import type { ReturnRequestItemInput } from "vtex.return-app";
import { useCssHandles } from "vtex.css-handles";
import { useRuntime } from "vtex.render-runtime";

import { defaultReturnConditionsMessages } from "../../../common/utils/defaultReturnConditionsMessages";

interface Props {
  items: ItemToReturn[];
  selectedItems: ReturnRequestItemInput[];
}

const CSS_HANDLES = [
  "returnInfoTableContainer",
  "returnInfoTheadContainer",
  "returnInfoTableText",
  "returnInfoBodyContainer",
  "returnInfoTrBodyWrapper",
  "returnInfoBodyImgWrapper",
  "returnInfoReasonConditionWrapper",
] as const;

export const ReturnInformationTable = ({ items, selectedItems }: Props) => {
  const { formatMessage } = useIntl();
  const handles = useCssHandles(CSS_HANDLES);

  const {
    hints: { phone },
  } = useRuntime();

  return (
    <table className={`${handles.returnInfoTableContainer} w-100`}>
      <thead
        className={`${handles.returnInfoTheadContainer} w-100 ph4 truncate overflow-x-hidden c-muted-2 f6`}
      >
        <tr className="w-100 truncate overflow-x-hidden">
          <th
            className={`${handles.returnInfoTableText} v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc`}
          >
            <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
          </th>
          <th
            className={`${handles.returnInfoTableText} v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc`}
          >
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
          </th>
        </tr>
      </thead>
      <tbody className={`${handles.returnInfoBodyContainer} v-mid`}>
        {selectedItems.map((item, index) => {
          const { quantity, orderItemIndex, condition, returnReason } = item;
          const { reason } = returnReason;

          if (!quantity) {
            return null;
          }

          // Buscar el elemento en 'items' con el mismo 'orderItemIndex'
          const selectedItem = items.find(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (item) => item.orderItemIndex === orderItemIndex
          );

          if (!selectedItem) {
            return null;
          }

          const { imageUrl, localizedName, name } = selectedItem;

          return (
            <tr
              key={index}
              className={`${handles.returnInfoTrBodyWrapper} ph5`}
            >
              <td className={`pv5 ${phone ? "w-80" : "w-50"}`}>
                <div className="flex items-center">
                  <div className={`${handles.returnInfoBodyImgWrapper} mr3`}>
                    <img src={imageUrl} alt="Product" />
                  </div>
                  <div className={handles.returnInfoReasonConditionWrapper}>
                    <p className="b">{localizedName ?? name}</p>
                    {!condition ? null : (
                      <div className="flex">
                        <p className="f6 mt0 mr3 gray b">
                          <FormattedMessage id="store/return-app.return-information-table.table-row.p-condition" />
                        </p>
                        <p className="f6 mt0 gray ">
                          {formatMessage(
                            defaultReturnConditionsMessages[condition]
                          )}
                        </p>
                      </div>
                    )}
                    <div className="flex">
                      <p className="f6 mv0 mr3 gray b">
                        {" "}
                        <FormattedMessage id="store/return-app.return-information-table.table-row.p-reason" />{" "}
                      </p>
                      <p className="f6 mv0 gray ">
                        {returnReason?.otherReason
                          ? returnReason?.otherReason
                          : reason}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
              <td className={`tc pv5 ${phone ? "w-20" : "w-50"}`}>
                <p>{quantity}</p>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
