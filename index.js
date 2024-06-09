const app = require('./app');
const db = require('./config/db')

const port = 8080 || process.env.PORT;

app.get('/', (req, res) => {

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});