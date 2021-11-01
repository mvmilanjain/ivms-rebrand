import {instance} from "./config.service";

import axios from "axios";

const postAttachment = (data) => instance({url: '/attachments', method: 'post', data});

const deleteAttachment = (id) => instance({url: `/attachments/${id}`, method: 'delete'});

const s3Uploader = (data) => axios({
    baseURL: process.env.REACT_APP_S3_FILE_UPLOAD_URL, method: 'post', data
});

export {postAttachment, deleteAttachment, s3Uploader};
