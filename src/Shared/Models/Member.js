class Member {
    constructor(props) {
        const {
            id = '',
            employee_id = '',
            status = '',
            employment_start_date = null,
            employment_end_date = null,
            role = '',

            first_name = '',
            last_name = '',
            email = '',
            nationality = '',
            identification_number = '',
            passport_end_date = null,
            residential_status = '',

            current_vehicle_id = '',
            driving_license_expiry_date = null,
            pdp_expiry = null,
            work_permit_end_date = null,
            medical_expiry_date = null,

            relative_details = null,
            bank_account_details = null,
            login = null,
        } = props || {};
        this.id = id;
        this.employee_id = employee_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role = role;
        this.identification_number = identification_number;
        this.status = status;
        this.residential_status = residential_status;
        this.nationality = nationality;
        this.current_vehicle_id = current_vehicle_id;
        this.driving_license_expiry_date = driving_license_expiry_date;
        this.pdp_expiry = pdp_expiry;
        this.work_permit_end_date = work_permit_end_date;
        this.employment_start_date = employment_start_date;
        this.employment_end_date = employment_end_date;
        this.passport_end_date = passport_end_date;
        this.medical_expiry_date = medical_expiry_date;
        this.relative_details = new RelativeDetails(relative_details);
        this.bank_account_details = new BankDetails(bank_account_details);
        this.login = new LoginDetails(login);
    }

    getFullName() {
        return `${this.first_name || ''} ${this.last_name || ''}`.trim();
    }
}

class RelativeDetails {
    constructor(props) {
        const {relative_first_name = '', relative_last_name = '', relative_phone_number = ''} = props || {};
        this.relative_first_name = relative_first_name;
        this.relative_last_name = relative_last_name;
        this.relative_phone_number = relative_phone_number;
    }
}

class BankDetails {
    constructor(props) {
        const {bank_name = '', account_number = ''} = props || {};
        this.bank_name = bank_name;
        this.account_number = account_number;
    }
}

class LoginDetails {
    constructor(props) {
        const {username = '', password = '', password_confirmation = ''} = props || {};
        this.username = username;
        this.password = password;
        this.password_confirmation = password_confirmation;
    }
}

export {Member};
