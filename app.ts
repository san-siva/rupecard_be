import express, { Response, Request } from 'express';
import axios from 'axios';
import helmet from 'helmet';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// sets headers to prevent common vulnerabilities
app.use(
	helmet.hsts({
		maxAge: 86400,
		includeSubDomains: true,
	})
);

// for parsing application/json
app.use(bodyParser.json());

app.post('/submit', async (req: Request, res: Response) => {
	try {
		const { name, phone } = req.body;
		if (!phone || !name)
			return res.status(400).json({
				message: 'Bad request',
			});
		if (phone.length !== 10)
			return res.status(400).json({
				message: 'Invalid phone number',
			});

		const response = await axios.post(
			'https://sheets.googleapis.com/v4/spreadsheets/1LSZocCyaLcSArtNyf0inxa6xgICDHBaLEbxf6UIA-6U/values/Sheet1!A:B:append?valueInputOption=RAW?insertDataOption=INSERT_ROWS',
			{
				values: [[name, phone]],
			},
			{
				headers: {
					Authorization: `Bearer token_here`,
					'x-goog-user-project': 'project_here',
					'Content-Type': 'application/json; charset=UTF-8',
					'X-goog-api-key': 'api_key_here',
				},
			}
		);
		console.log(response?.data);

		return res.status(200).json({
			message: 'Success',
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: 'Internal server error',
		});
	}
});

app.listen(PORT, () => {
	return console.log(`Authorisation server is running on port ${PORT}`);
});
