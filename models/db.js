// mysql2/promise 라이브러리를 가져옵니다.
const mysql = require('mysql2/promise');

// 데이터베이스 연결 풀(Connection Pool)을 생성합니다.
const pool = mysql.createPool({
    host: '34.22.68.140',  // DB 호스트 주소
    user: 'root',        // DB 사용자 이름
    password: "Roehd007@",          // DB 비밀번호
    database: "userdb",              // 사용할 데이터베이스 이름
    port: 3306,
});

exports.db = {

    dbInsert: async function(body) {

        const id = body.id;
        const password = body.password;

        // 1. SQL 쿼리문 작성 (SQL Injection 방지를 위해 ? 사용)
        const sql = "INSERT INTO users (id, password) VALUES (?, ?)";

        // 2. 쿼리에 바인딩할 값 배열
        const values = [id, password];

        try {
            // 3. 풀에서 쿼리를 실행합니다.
            // pool.query()는 [rows, fields] 배열을 반환합니다.
            // INSERT, UPDATE, DELETE의 경우 rows에 결과 객체가 담깁니다.
            const [result] = await pool.query(sql, values);

            console.log('데이터 삽입 성공:', result);

            // 4. INSERT 결과 반환 (예: { affectedRows: 1, insertId: ... })
            return {result: true};

        } catch (error) {
            // 5. 오류 처리
            // (예: id 중복 (ER_DUP_ENTRY), 연결 실패 등)
            console.error('데이터베이스 삽입 중 오류 발생:', error);

            return {result: false};
        }

    }


}