class InspectionForm {
    constructor(props) {
        const {id = '', name = '', description = '', inspection_form_sections = []} = props || {};
        this.id = id;
        this.name = name;
        this.description = description;
        this.inspection_form_sections = [];
        this.setInspectionFormSections(inspection_form_sections);
    }

    setInspectionFormSections(inspectionFormSections) {
        this.inspection_form_sections = inspectionFormSections.map(item => new FormSection(item));
    }
}

class FormSection {
    constructor(props) {
        const {id = '', name = '', inspection_form_id, form_section_fields = []} = props || {};
        this.id = id;
        this.name = name;
        this.inspection_form_id = inspection_form_id;
        this.form_section_fields = [];
        this.setFormSectionFields(form_section_fields);
    }

    setFormSectionFields(formSectionFields) {
        this.form_section_fields = formSectionFields.map(item => new FormSectionField(item));
    }
}

class FormSectionField {
    constructor(props) {
        const {
            id = '',
            inspection_form_section_id = '',
            name = '',
            field_type = '',
            position = '',
            required = false,
            instructions = ''
        } = props || {};
        this.id = id;
        this.inspection_form_section_id = inspection_form_section_id;
        this.name = name;
        this.field_type = field_type;
        this.position = position;
        this.required = required;
        this.instructions = instructions;
    }
}

export {InspectionForm, FormSection, FormSectionField};
