Аутентификация через http-only cookie, без участия джаваскрипта на стороне клиента. Частично реализован SSR (изначальное состояние pinia store вычисляется на сервере в зависимости от значения accessToken cookie). В качестве ORM выбрал TypeORM. Для удобства тестирования добавил возможность выбора продолжительности действия токена.
