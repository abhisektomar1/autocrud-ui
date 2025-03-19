import * as Yup from "yup";

export const configurationSchemas = {
  code: Yup.object().shape({
    language: Yup.string().required("Language is required"),
    code: Yup.string().required("Code is required"),
  }),
  api: Yup.object().shape({
    url: Yup.string().url("Must be a valid URL").required("URL is required"),
    method: Yup.string().required("Method is required"),
    headers: Yup.object(),
  }),
  delay: Yup.object().shape({
    duration: Yup.number()
      .min(0, "Duration must be positive")
      .required("Duration is required"),
    unit: Yup.string().required("Time unit is required"),
  }),
  email: Yup.object().shape({
    to: Yup.string().email("Must be a valid email").required("To is required"),
    subject: Yup.string().required("Subject is required"),
    body: Yup.string().required("Body is required"),
  }),
};
