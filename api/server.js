let users = [
  { name: 'Andrey', login: 'ryab' },
  { name: 'Kirill', login: 'krl' },
];

module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json(users);
  }
  if (req.method === 'POST') {
    users.push(req.body);
    res.status(200).json(users);
  }
  if (req.method === 'PUT') {
    users[0].name = req.body.name;
    res.status(200).json(users);
  }
  if (req.method === 'DELETE') {
    users.splice(users.findIndex(item => item.name === req.body.name), 1);
    res.status(200).json(users);
  }
}
