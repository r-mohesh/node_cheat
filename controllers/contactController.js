const asyncHandler = require("express-async-handler");
const Contract = require("../model/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contract.find({ user_id: req.user._id });
  res.status(200).json(contact);
});

//@desc create  contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please provide all the fields");
  }
  const contact = await Contract.create({
    name,
    email,
    phone,
    user_id: req.user._id,
  });
  res.status(201).json(contact);
});

//@desc Get contacts by id
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contract.findById(req.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update contact by id
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contract.findById(req.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user._id) {
    response.status(403);
    throw new Error("Contact is not authorized to update");
  }
  const updatedContact = await Contract.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Delete contact by id
//@route Delete /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contract.findById(req.params.id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user._id) {
    response.status(403);
    throw new Error("Contact is not authorized to delete");
  }
  await Contract.remove();
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
