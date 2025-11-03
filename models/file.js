const { Storage } = require('@google-cloud/storage');

const path = require('path');

// 키 파일 경로를 직접 지정합니다.
const KEY_FILE_PATH = path.join(__dirname, '../utility/student10_key.json');

console.log(`Upload GCP Key with ${KEY_FILE_PATH}`);

// GCP Storage 클라이언트 초기화 (인증 정보는 환경 변수 또는 서비스 계정으로 자동 처리됩니다.)
const storage = new Storage({
    keyFilename: KEY_FILE_PATH
});


// 업로드할 버킷 이름과 폴더 경로를 설정합니다.
const BUCKET_NAME = 'student10_bucket'; // 반드시 본인의 버킷 이름으로 변경하세요! YOUR_GCS_BUCKET_NAME
const gcsBucket = storage.bucket(BUCKET_NAME);

exports.file = {

    gcpStorageUpload: function(file) {

        return new Promise((resolve, reject) => {
            if (!file) {
                return reject(new Error('No file provided.'));
            }

            // 파일명을 고유하게 만들기 위해 타임스탬프를 사용합니다.
            const fileExtension = path.extname(file.originalname);
            const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

            // GCS 파일 참조 생성 (destination은 GCS 상의 경로/파일명)
            const blob = gcsBucket.file(uniqueFilename);

            // GCS 업로드 스트림 생성
            const blobStream = blob.createWriteStream({
                resumable: false, // 단일 요청으로 처리 (대용량 파일은 true 고려)
                contentType: file.mimetype, // 파일 MIME 타입 설정
            });

            // 스트림 오류 처리
            blobStream.on('error', (err) => {
                reject(err);
            });

            // 스트림 완료 (업로드 성공)
            blobStream.on('finish', () => {
                // 파일에 대한 공개 URL 반환 (버킷 권한 설정에 따라 접근 가능 여부가 결정됨)
                const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${uniqueFilename}`;
                resolve(publicUrl);
            });

            // Multer의 Buffer를 GCS 스트림으로 파이프
            blobStream.end(file.buffer);
        });

    }

}