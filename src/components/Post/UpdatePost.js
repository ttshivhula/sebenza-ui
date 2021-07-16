import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import { sessionState } from "store/session";
import { useSetRecoilState } from "recoil";
import { Client, DEFAULT_SERVER_ERROR_MESSAGE, ApiError } from "api";
import * as Yup from "yup";

const postSchema = Yup.object().shape({
  body: Yup.string()
    .required("Body is required")
    .min(5, "Body should be 5 chars minimum"),
});

export default function UpdatePost({
  open,
  setOpen,
  post,
  setPost,
  isLoading,
  setIsLoading,
  ...props
}) {
  const setSessionState = useSetRecoilState(sessionState);
  const cancelButtonRef = useRef(null);

  const updatePost = async (values) => {
    setIsLoading(true);
    try {
      const { message } = await Client.updatePost(post.id, {
        body: values.body,
      });
      setPost(null);
      setOpen(false);
      setSessionState((old) => {
        return {
          toast: {
            heading: "Success!",
            message,
          },
        };
      });
    } catch (err) {
      let message = DEFAULT_SERVER_ERROR_MESSAGE;
      if (err instanceof ApiError) {
        message = err.message;
      }
      setSessionState((old) => {
        return {
          toast: {
            heading: "Error!",
            message,
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={() => {
          setOpen(true);
        }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <Formik
                initialValues={{
                  body: post.body,
                }}
                validationSchema={postSchema}
                onSubmit={updatePost}
              >
                {({ errors, touched }) => (
                  <Form className="w-full">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Update post
                        </Dialog.Title>
                        <div className="mt-2">
                          <Field
                            as="textarea"
                            id="body"
                            name="body"
                            className="bg-gray-200 w-full rounded-lg border p-2"
                            rows="5"
                            placeholder="Speak your mind"
                            errors={touched.body && errors.body}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isLoading}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
