const createBook = (req, res) => {
	res.json({ message: "Book created successfully", user: req.user });
};

const updateBook = (req, res) => {
	res.json({ message: `Book ${req.params.id} updated successfully` });
};

const deleteBook = (req, res) => {
	res.json({ message: `Book ${req.params.id} deleted successfully` });
};

const borrowBook = (req, res) => {
	res.json({ message: `Book ${req.params.id} borrowed successfully` });
};

const getProfile = (req, res) => {
	res.json({ message: "User profile fetched", user: req.user });
};

export default {
	createBook,
	updateBook,
	deleteBook,
	borrowBook,
	getProfile
};