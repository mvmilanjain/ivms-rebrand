class Finance {
    constructor(props) {
        const {
            id = '',
            order_number = '',
            status = '',
            document_validated = false,
            document_sent_to_client = false,
            payment_recieved = false,
            invoice_recieved = false,
        } = props || {};
        this.id = id;
        this.order_number = order_number;
        this.status = status;
        this.order_state = 'finance';
        this.document_validated = document_validated;
        this.document_sent_to_client = document_sent_to_client;
        this.payment_recieved = payment_recieved;
        this.invoice_recieved = invoice_recieved;
    }

    setOrder(order) {
        const {id} = order || {};
        this.id = id;
    }
}

export {Finance};
