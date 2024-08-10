const api = {
    harbor: {
        all(callback) {
            const harbors = [
                {
                    seq: 1,
                    place: "광안리 해수욕장",
                    lat: 35.15317903835004,
                    lng: 129.1186237335205,
                },
                {
                    seq: 2,
                    place: "당진 아미미술관",
                    lat: 36.8617816,
                    lng: 126.6803672,
                },
                {
                    seq: 3,
                    place: "쏠비치 삼척",
                    lat: 37.4713372,
                    lng: 129.1638649,
                },
                {
                    seq: 4,
                    place: "서귀포 가시리마을",
                    lat: 33.3828211,
                    lng: 126.7313785,
                },
                {
                    seq: 5,
                    place: "강화도 조양방직",
                    lat: 37.7467621,
                    lng: 126.4802769,
                },
            ];
            callback({success: true, harbors});
        },
    },
};

export default api;
