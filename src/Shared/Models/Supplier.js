import {Address} from "./Address";

class BankDetails {
    constructor(props) {
        const {
            name = '',
            bank_name = '',
            branch_code = '',
            account_number = ''
        } = props || {};
        this.name = name;
        this.bank_name = bank_name;
        this.branch_code = branch_code;
        this.account_number = account_number;
    }
}

class Supplier {
    constructor(props) {
        const {
            id = '',
            name = '',
            email = '',
            address = null,
            tax_number = '',
            company_name = '',
            bank_details = null
        } = props || {};
        this.id = id;
        this.name = name;
        this.email = email;
        this.address = new Address(address);
        this.tax_number = tax_number;
        this.company_name = company_name;
        this.bank_details = new BankDetails(bank_details);
    }
}

export {Supplier};
