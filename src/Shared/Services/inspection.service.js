const inspection_forms = '/inspection_forms';
const form_sections = '/form_sections';
const form_section_fields = '/form_section_fields';
const inspection_report = '/inspection_reports'

// INSPECTION FORM
const getInspectionForms = (params) => ({url: inspection_forms, method: 'get', params});

const getInspectionForm = (id, params) => ({url: `${inspection_forms}/${id}`, method: 'get', params});

const postInspectionForm = (data) => ({url: inspection_forms, method: 'post', data});

const putInspectionForm = (id, data) => ({url: `${inspection_forms}/${id}`, method: 'put', data});

const deleteInspectionForm = (id) => ({url: `${inspection_forms}/${id}`, method: 'delete'});

// INSPECTION FORM SECTION
const getInspectionFormSections = (params) => ({url: form_sections, method: 'get', params});

const getInspectionFormSection = (id, params) => ({url: form_sections, method: 'get', params});

const postInspectionFormSection = (data) => ({url: form_sections, method: 'post', data});

const putInspectionFormSection = (id, data) => ({url: `${form_sections}/${id}`, method: 'put', data});

const deleteInspectionFormSection = (id) => ({url: `${form_sections}/${id}`, method: 'delete'});

// INSPECTION FORM SECTION FIELD
const getInspectionFormSectionFields = (params) => ({url: form_section_fields, method: 'get', params});

const getInspectionFormSectionField = (id, params) => ({url: form_section_fields, method: 'get', params});

const postInspectionFormSectionField = (data) => ({url: form_section_fields, method: 'post', data});

const putInspectionFormSectionField = (id, data) => ({url: `${form_section_fields}/${id}`, method: 'put', data});

const deleteInspectionFormSectionField = (id) => ({url: `${form_section_fields}/${id}`, method: 'delete'});

// INSPECTION REPORT
const getInspectionReports = (params) => ({url: inspection_report, method: 'get', params});

const getInspectionReport = (id, params) => ({url: `${inspection_report}/${id}`, method: 'get', params});

const postInspectionReport = (data) => ({url: inspection_report, method: 'post', data});

const putInspectionReport = (id, data) => ({url: `${inspection_report}/${id}`, method: 'put', data});

const deleteInspectionReport = (id) => ({url: `${inspection_report}/${id}`, method: 'delete'});

export {
    getInspectionForms,
    getInspectionForm,
    postInspectionForm,
    putInspectionForm,
    deleteInspectionForm,
    getInspectionFormSections,
    getInspectionFormSection,
    postInspectionFormSection,
    putInspectionFormSection,
    deleteInspectionFormSection,
    getInspectionFormSectionFields,
    getInspectionFormSectionField,
    postInspectionFormSectionField,
    putInspectionFormSectionField,
    deleteInspectionFormSectionField,
    getInspectionReports,
    getInspectionReport,
    postInspectionReport,
    putInspectionReport,
    deleteInspectionReport
};
