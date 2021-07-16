class ClientV1 {
   baseUrl = "https://0xzero.dev/api";
  token = "";

  setToken(token) {
    this.token = token;
  }

  authRoutes = {
    signIn: () => {
      return `/users/login`;
    },

    signUp: () => {
      return `/users/register`;
    },
  };

  postRoutes = {
    getPosts: () => {
      return `/posts`;
    },
    createPost: () => {
      return `/posts`;
    },
    currentPost: (id) => {
      return `/posts/${id}`;
    },
  };

  signUpUser(body) {
    return this.fetch(this.authRoutes.signUp(), { method: "POST", body });
  }

  signInUser(body) {
    return this.fetch(this.authRoutes.signIn(), { method: "POST", body });
  }

  getPosts() {
    return this.fetch(this.postRoutes.getPosts(), { method: "GET" });
  }

  createPost(body) {
    return this.fetch(this.postRoutes.getPosts(), { method: "POST", body });
  }

  deletePost(id) {
    return this.fetch(this.postRoutes.currentPost(id), { method: "DELETE" });
  }

  updatePost(id, body) {
    return this.fetch(this.postRoutes.currentPost(id), {
      method: "PATCH",
      body,
    });
  }

  constructHeadersFromOptions(options) {
    const headers = {};

    let contentType;

    if (options.contentType) {
      contentType = options.contentType;
    } else if (
      !options.contentType &&
      options.method !== "GET" &&
      options.method !== "DELETE" &&
      !(options.body instanceof FormData)
    ) {
      contentType = "application/json";
    }

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async fetch(url, options) {
    const fetchOpts = {
      method: options.method ? options.method : "GET",
    };

    if (options.body) {
      fetchOpts.body =
        options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body);
    }

    fetchOpts.headers = this.constructHeadersFromOptions(options);

    let finalUrl = url;

    if (this.baseUrl.length) {
      finalUrl = this.baseUrl + url;
    }

    const response = await fetch(finalUrl, fetchOpts);

    if (response.status === 204) {
      return Promise.resolve(true);
    }

    const responseBody = await response.json();

    if (!responseBody.success || !response.ok) {
      throw new ApiError(responseBody);
    }

    return responseBody;
  }
}

class ApiError extends Error {
  constructor(response, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";
    this.response = response;
    this.message = response.message;
  }
}

export default ClientV1;
export { ApiError };
