import axios from 'axios';
import { useEffect, useState } from 'react';

const DOCUMENT_LIST_POLL_TIME = 10000;

/**
 * Register a new user.
 * @param {object} inputs the inputs.
 * @param {string} inputs.username the username.
 * @param {string} inputs.password the password.
 * @param {string} inputs.fullName the full name.
 * @returns {Promise.<{success: true} | {success: false, message: string}>} promise containing nothing of interest when successful or a message describing the failure.
 */
export const registerUser = async ({ username, password, fullName }) => {
  const { data } = await axios.post('/users', { username, password, fullName });
  return data;
};

/**
 * Get the secret key and key hint associated with the document.
 * The secret key is used by RTC to encrypt all content and messages that are
 * sent to the RTC server. This ensures privacy as the RTC server has no way
 * to read or recreate the content of the document.
 * When no key hint is provided the integration is allowed to generate a new
 * key with an associated unique key hint (for example the time of creation),
 * however if a key hint is provided then the key that was originally issued
 * with that hint must be returned.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @param {string | null} inputs.keyHint the key hint is used to request a specific secret key that has been returned in the past.
 * @returns {Promise.<{success: true, key: string, keyHint: string}>} promise that contains the secret key and hint.
 */
 export const getSecretKey = async ({ documentId, keyHint }) => {
    const { data } = await axios.get(`/documents/${documentId}/key`, { params: { keyHint } });
    if (!data.success) throw new Error(data.message);
    return data;
};

/**
 * Get a JSON Web Token that relates specifically to this document and the role the user has.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @returns {Promise.<{success: true, token: string}>} promise that contains the token.
 */
 export const getJwt = async ({ documentId }) => {
  const { data } = await axios.get(`/documents/${documentId}/jwt`);
  if (!data.success) throw new Error(data.message);
  return data;
};

/**
 * Create a JWT to login.
 * @param {object} inputs the inputs.
 * @param {string} inputs.username the username.
 * @param {string} inputs.password the password. 
 * @returns {Promise.<{success: true, token: string} | {success: false, message: string}>} promise containing the jwt token when successful or a message describing the failure.
 */
export const loginUser = async ({ username, password }) => {
  const { data } = await axios.post('/jwt', { username, password });
  return data;
}

/**
 * Gets a list of all the users.
 * @returns {Promise.<{success: true, users: string[]}>} promise containing the list of usernames.
 */
export const getUsers = async () => {
  const { data } = await axios.get('/users');
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * Get the details of a user.
 * @param {object} inputs the inputs.
 * @param {string} inputs.userId the username.
 * @returns {Promise.<{success: true, fullName: string}>} promise containing the user details.
 */
export const getUserDetails = async ({ userId }) => {
  const { data } = await axios.get(`/users/${userId}`);
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};


export const getUserAccessLevel = async ({userId, documentId}) => {
  const { data } = await axios.get(`/users/${userId}/documents/${documentId}/access`);
  if (!data.success) {
    throw new Error(data.message);
  }
  
  return data;
};

/**
 * Gets a list of all the documents available to the logged in user.
 * @returns {Promise.<{success: true, documents: string[]}>} promise containing the list of documents.
 */
export const getDocuments = async () => {
  const { data } = await axios.get('/documents');
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * Create a new document.
 * @param {object} inputs the inputs.
 * @param {string} inputs.title the document title.
 * @returns {Promise.<{success: true, uuid}>} promise containing the document uuid.
 */
export const createDocument = async ({ title }) => {
  const { data } = await axios.post('/documents', { title });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
}

/**
 * Get the document title.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @returns {Promise.<{success: true, title: string}>} promise containing the document title.
 */
export const getDocumentTitle = async ({ documentId }) => {
  const { data } = await axios.get(`/documents/${documentId}/title`);
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
}

/**
 * Get the list of collaborators
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @returns {Promise.<{success: true, collaborators: Collaborator[]}>} promise containing the collaborators.
 */
export const getCollaborators = async ({ documentId }) => {
  const { data } = await axios.get(`/documents/${documentId}/collaborators`);
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * Sets the access of a collaborator.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @param {string} inputs.username the username.
 * @param {Access} inputs.access the access.
 * @returns {Promise.<{success: true}>} promise that resolves on success.
 */
export const setCollaborator = async ({ documentId, username, access }) => {
  const { data } = await axios.put(`/documents/${documentId}/collaborators/${username}`, { access });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * Get the document content.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @returns {Promise<{success: true, content: string}>} promise containing the content.
 */
export const getContent = async ({ documentId }) => {
  const { data } = await axios.get(`/documents/${documentId}/content`);
  if (!data.success) throw new Error(data.message);
  return data;
};

/**
 * Save the document content.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @param {string} inputs.content the content.
 * @param {string} inputs.version the version generated by RTC which will always be larger for more recent changes.
 * @returns {Promise.<{success: true}>} promise that resolves on success.
 */
export const saveContent = async ({ documentId, version, content }) => {
  const { data } = await axios.put(`/documents/${documentId}/content`, { content, version });
  if (!data.success) {
    throw new Error(data.message);
  }
  return data;
};

/**
 * Hook to get details about a user.
 * @param {object} inputs the inputs.
 * @param {string} inputs.userId the username.
 * @returns {{fullName: string}}
 */
export const useUserDetails = ({ userId }) => {
  const [details, setDetails] = useState({ });
  useEffect(() => {
    if (userId) {
      getUserDetails({ userId })
        .then(({ fullName }) => setDetails({ fullName }))
        .catch((e) => console.log(e.message));
    } else {
      setDetails({ });
    }
  }, [userId]);
  return details;
};

/**
 * Hook to gather the list of documents accessible by the current user.
 * @param {object} inputs the inputs.
 * @param {string} inputs.token the JWT token used to represent the current user.
 * @returns {{documents: string[], appendDocument: (documentId: string) => void}}
 */
export const useDocuments = ({ token }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const update = () => {
      getDocuments()
        .then(({ documents }) => setDocuments(documents ?? []))
        .catch((e) => console.log(e.message));
    };
    update();
    const timer = setInterval(update, DOCUMENT_LIST_POLL_TIME);
    return () => clearInterval(timer);
  }, [token]);
  const appendDocument = (documentId) => setDocuments((documents) => [...documents, documentId]);
  return { documents, appendDocument };
};

/**
 * Hook to get the document title.
 * @param {object} inputs the inputs.
 * @param {string} inputs.documentId the document ID.
 * @returns {string} the document title.
 */
export const useDocumentTitle = ({ documentId }) => {
  const [title, setTitle] = useState('');
  useEffect(() => {
    getDocumentTitle({ documentId }).then(({ title }) => setTitle(title)).catch((e) => console.log(e.message));
  }, [documentId]);
  return title;
};

/**
 * Hook to get the list of collaborators on a document and the access of the current user.
 * Also returns a method to trigger a refresh of the collaborators list.
 * @param {object} inputs the inputs. 
 * @param {string} inputs.documentId the document ID.
 * @param {string} inputs.username the username of the current user.
 * @returns {{collaborators: Collaborator[], access: Access, requestCollaborators: () => void}} the collaborators and the access the user has.
 */
export const useCollaborators = ({ documentId, username }) => {
  const [tick, setTick] = useState(0);
  const [collaborators, setCollaborators] = useState([]);
  const [access, setAccess] = useState(undefined);
  useEffect(() => {
    getCollaborators({ documentId }).then(({ collaborators }) => {
      setCollaborators(collaborators);
      setAccess((collaborators.find((c) => c.username === username) ?? {}).access);
    }).catch((e) => console.log(e.message));
  }, [documentId, username, tick]);
  const requestCollaborators = () => setTick((prev) => prev + 1);
  return { collaborators, access: access, requestCollaborators };
};

/**
 * Hook to get the list of users that could be added as a collaborator, only updating when needed is true.
 * @param {object} inputs the inputs.
 * @param {Collaborator[]} inputs.collaborators the collaborators.
 * @param {boolean} inputs.needed is the user list currently needed.
 * @returns {string[]} the list of possible users excluding the ones that are already collaborating.
 */
export const usePossibleCollaborators = ({ collaborators, needed }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (needed) {
      getUsers().then(({ users }) => {
        const userLookup = Object.fromEntries(collaborators.map((c) => [c.username, true]));
        setUsers(users.filter((user) => !userLookup[user]));
      }).catch((e) => console.log(e.message));
    }
  }, [collaborators, needed]);
  return users;
};
