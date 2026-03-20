const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  // Pobieramy URI ze zmiennych środowiskowych Netlify
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return {
      statusCode: 500,
      body: "BŁĄD: Brak zmiennej MONGODB_URI w Netlify!",
    };
  }

  const client = new MongoClient(uri);

  try {
    // Próba połączenia
    await client.connect();

    // Sprawdźmy listę baz danych, żeby potwierdzić, że mamy uprawnienia
    const databasesList = await client.db().admin().listDatabases();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "Sukces!",
        message: "Połączono z MongoDB Atlas",
        databases: databasesList.databases.map((db) => db.name),
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  } finally {
    await client.close();
  }
};
