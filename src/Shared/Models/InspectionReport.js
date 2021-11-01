class InspectionReport {
    constructor(props) {
        const {
            id = '',
            report_number = '',
            location_id = '',
            location = null,
            inspection_form_id = '',
            inspection_form = null,
            inspector_id = '',
            inspector = null,
            vehicle_id = '',
            vehicle = null,
            meter_reading = 0,
            meter_reading_unit = 'miles',
            condition = '',
            is_vehicle_safe = false,
            maintainence_required = false,
            additional_note = '',
            status = '',
            inspection_report_sections = []
        } = props || {};

        this.id = id;
        this.report_number = report_number;
        this.location_id = location_id;
        this.location = location;
        this.inspection_form_id = inspection_form_id;
        this.inspection_form = inspection_form;
        this.inspector_id = inspector_id;
        this.inspector = inspector;
        this.vehicle_id = vehicle_id;
        this.vehicle = vehicle;
        this.meter_reading = meter_reading;
        this.meter_reading_unit = meter_reading_unit;
        this.condition = condition;
        this.is_vehicle_safe = is_vehicle_safe;
        this.maintainence_required = maintainence_required;
        this.additional_note = additional_note;
        this.status = status;
        this.inspection_report_sections = [];
        this.setInspectionReportSection(inspection_report_sections);
    }

    setInspectionReportSection(inspectionReportSection) {
        this.inspection_report_sections = inspectionReportSection.map(item => new InspectionReportSection(item));
    }

    setLocation(location) {
        const {id = ''} = location || {};
        this.location_id = id;
        this.location = location;
    }

    setInspector(inspector) {
        const {id = ''} = inspector || {};
        this.inspector_id = id;
        this.inspector = inspector;
    }

    setInspectionForm(form) {
        const {id = '', inspection_form_sections = []} = form || {};
        this.inspection_form_id = id;
        this.inspection_form = form;
        this.setInspectionFormSection(inspection_form_sections);
    }

    setInspectionFormSection(inspectionReportSection) {
        this.inspection_report_sections = inspectionReportSection.map(item => {
            const inspectionReportSectionProps = {
                name: item.name,
                inspection_form_section_id: item.id,
                inspection_report_section_fields: !item.form_section_fields ? [] : item.form_section_fields.map(sectionField => ({
                    form_section_field_id: sectionField.id,
                    name: sectionField.name,
                    field_type: sectionField.field_type,
                    position: sectionField.position,
                    required: sectionField.required,
                    instructions: sectionField.instructions
                }))
            }
            return new InspectionReportSection(inspectionReportSectionProps);
        });
    }

    setVehicle(vehicle) {
        const {id = '', meter_reading = 0, meter_reading_unit = 'miles'} = vehicle || {};
        this.vehicle_id = id;
        this.vehicle = vehicle;
        this.meter_reading = meter_reading;
        this.meter_reading_unit = meter_reading_unit;
    }
}

class InspectionReportSection {
    constructor(props) {
        const {
            id = '',
            name = '',
            inspection_form_section_id = '',
            inspection_report_section_fields = []
        } = props || {};

        this.id = id;
        this.name = name;
        this.inspection_form_section_id = inspection_form_section_id;
        this.inspection_report_section_fields = [];
        this.setInspectionReportSectionFields(inspection_report_section_fields);
    }

    setInspectionReportSectionFields(inspectionReportSectionField) {
        this.inspection_report_section_fields = inspectionReportSectionField.map(item => new InspectionReportSectionField(item));
    }
}

class InspectionReportSectionField {
    constructor(props) {
        const {
            id = '',
            form_section_field_id = '',
            name = '',
            field_type = '',
            position = '',
            required = false,
            instructions = '',
            inspection_report_section_field_value = null
        } = props || {};

        this.id = id;
        this.form_section_field_id = form_section_field_id;
        this.name = name;
        this.field_type = field_type;
        this.position = position;
        this.required = required;
        this.instructions = instructions;
        this.inspection_report_section_field_value = new InspectionReportSectionFieldValue(inspection_report_section_field_value);
    }
}

class InspectionReportSectionFieldValue {
    constructor(props) {
        const {
            id = '',
            value = '',
            notes = '',
            attachment = null
        } = props || {};

        this.id = id;
        this.value = value;
        this.notes = notes;
        this.attachment = attachment;
    }
}

export {InspectionReport};
