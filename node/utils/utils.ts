export function formatRequest(request: any) {
    return {
        id: request.id,
        orderId: request.orderId,
        totalPrice: request.totalPrice,
        refundedAmount: request.refundedAmount,
        status: request.status,
        dateSubmitted: request.dateSubmitted,
        customerInfo: {
            name: request.name,
            email: request.email,
            phoneNumber: request.phoneNumber,
            country: request.country,
            locality: request.locality,
            address: request.address,
        },
        paymentInfo: {
            paymentMethod: request.paymentMethod,
            iban: request.iban,
            giftCardCode: request.giftCardCode,
            giftCardId: request.giftCardId,
        }
    }
}

export function formatProduct(product: any) {
    return {
        image: product.imageUrl,
        refId: product.skuId,
        name: product.skuName,
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        totalPrice: product.totalPrice,
        goodProducts: product.goodProducts,
        reasonCode: product.reasonCode,
        reasonText: product.reason,
        status: product.status
    }
}

export function formatHistory(history: any) {
    return {
        status: history.status,
        dateSubmitted: history.dateSubmitted,
        submittedBy: history.submittedBy
    }
}

export function formatComment(comment: any) {
    return {
        comment: comment.comment,
        visibleForCustomer: comment.visibleForCustomer,
        status: comment.status,
        dateSubmitted: comment.dateSubmitted,
        submittedBy: comment.submittedBy,
    }
}

export function currentDate() {
    const d = new Date();
    return `${d.getFullYear()}-${
        (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`
    }-${d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`}`;
}

export function dateFilter(date: string, separator = "-") {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${year}${separator}${
        month < 10 ? `0${month}` : `${month}`
    }${separator}${day < 10 ? `0${day}` : `${day}`}`;
}
