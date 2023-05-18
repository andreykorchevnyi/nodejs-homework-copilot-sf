const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

// Маршрут для обработки запросов от Salesforce Canvas приложения
app.post('/canvas', async (req, res) => {
    console.log(req);
    try {
        // Получение oauthToken и refreshToken из тела запроса
        const { oauthToken } = req.body;

        // Запрос к Salesforce REST API для получения информации о пользователе
        const userInfoResponse = await axios.get(
            'https://login.salesforce.com/services/oauth2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${oauthToken}`,
                },
            }
        );

        // Извлечение нужной информации о пользователе
        const { userId, organizationId, name, picture, email } =
            userInfoResponse.data;

        // Верификация полученных данных (в данном случае просто проверка наличия id пользователя)
        if (!userId) {
            throw new Error('Invalid user data');
        }

        // Отправка верифицированных данных обратно клиенту
        res.json({
            id: userId,
            organizationId,
            name,
            avatar: picture,
            email,
        });
    } catch (error) {
        // Обработка ошибок
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
