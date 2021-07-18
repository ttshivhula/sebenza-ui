import * as Yup from "yup";
import Button from "components/Button";
import { Formik, Form, Field } from "formik";
import { Client, DEFAULT_SERVER_ERROR_MESSAGE, ApiError } from "api";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

const postSchema = Yup.object().shape({
  body: Yup.string()
    .required("Body is required")
    .min(5, "Body should be 5 chars minimum"),
});

export default function CreatePost({ getPosts }) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFile) => {
    const image = acceptedFile[0];
    if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setImage({
          name: image.name,
          url: reader.result,
        });
      };
      reader.readAsDataURL(image);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createPost = async (values) => {
    setIsLoading(true);
    try {
      const { message } = await Client.createPost({
        body: values.body,
        image: image ? image.url : null,
      });
      alert(message);
      getPosts();
      setIsLoading(false);
    } catch (err) {
      let message = DEFAULT_SERVER_ERROR_MESSAGE;
      if (err instanceof ApiError) {
        message = err.message;
      }
      alert(message);
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/gif",
    maxFiles: 1,
  });

  return (
    <Formik
      initialValues={{
        body: "",
      }}
      onSubmit={createPost}
      validationSchema={postSchema}
    >
      {({ errors, touched }) => (
        <Form className="px-4 py-4 sm:px-0">
          <div className="bg-white w-full shadow rounded-lg p-5">
            <Field
              as="textarea"
              id="body"
              name="body"
              className="bg-gray-200 w-full rounded-lg border p-2"
              rows="5"
              placeholder="Speak your mind"
              errors={touched.body && errors.body}
            />

            <div className="w-full flex flex-row flex-wrap mt-3">
              <div
                className="bg-gray-200 w-1/3 border-dashed border-4 flex justify-center rounded-lg items-center bg-opacity-40 text-sm"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {image ? image.name : "Select image"}
              </div>

              <div className="w-2/3">
                <Button
                  type="submit"
                  text="Post"
                  className="h-12 float-right bg-indigo-400 hover:bg-indigo-300 text-white pl-2 pr-2 rounded-lg"
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
