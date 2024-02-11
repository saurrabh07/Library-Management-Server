import csv from 'csv-parser';
import fs from 'fs';

async function readBooksFromFile(filePath) {
  return new Promise((resolve, reject) => {

    // take temp empty array for store books
    const tempBooks = [];

    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        
        tempBooks.push(data['Book Name']);

      })
      .on('end', () => {     

        resolve(tempBooks);

      })
      .on('error', (err) => {
        console.log("inside err");

        reject(err);
      });
  });
}

async function getBooks(req, res) {

  // let books = [];
  let Books = {};

    // check role of user
  const userType = req.user.role;

  //declare path
  const regularUserFilePath = './regularUser.csv';
  const adminUserFilePath = './adminUser.csv';

  try {
    const regularUserBooks = await readBooksFromFile(regularUserFilePath);
    Books["regularUser"]= regularUserBooks ;

    if (userType === 'admin') {
      const adminUserBooks = await readBooksFromFile(adminUserFilePath);
          Books["admin"] = adminUserBooks ;

      // Spread function for Merge and remove duplicates
      // books = [...new Set([...books, ...adminUserBooks])]; 
    }

    res.json({ Books });
  } catch (error) {
    console.error('Error reading books:', error);
    res.json({ message: 'Internal server error' });
  }
}

function addBook(req, res) {
//   res.send("addbook");


  const { bookName, author, publicationYear } = req.body;
  if (typeof bookName !== 'string' || typeof author !== 'string' || typeof publicationYear !== 'number') {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  // check role of user
  const userType = req.user.role;
  if (userType !== 'admin') {
    return res.json({ message: 'Access denied' });
  }
  
  //declare path
  const regularUserFilePath = './regularUser.csv';

  // add new book in books data
  fs.appendFileSync(regularUserFilePath, `${bookName},${author},${publicationYear}\n`);
  res.json({ message: 'Book added successfully ' , bookName });
}

function deleteBook(req, res) {
//   res.send("deleteBook");

  
  const { bookName } = req.body;
  if (typeof bookName !== 'string') {
    return res.json({ message: 'Invalid parameter' });
  }

  // check role of user
  const userType = req.user.role;
  if (userType !== 'admin') {
    return res.json({ message: 'Access denied' });
  }

  const regularUserFilePath = './regularUser.csv';
  let data = fs.readFileSync(regularUserFilePath, 'utf8');

  // deleting book which given in req
  const lines = data.split('\n');
  const filteredLines = lines.filter(line => line.toLowerCase().indexOf(bookName.toLowerCase()) === -1);
  const updatedData = filteredLines.join('\n');

  // here update file 
  fs.writeFileSync(regularUserFilePath, updatedData);
  res.json({ message: 'Book deleted successfully ' , bookName });

}

export { getBooks, addBook, deleteBook };
