export type GeocodeResult = {
    lat: number;
    lng: number;
    displayName: string;
  };
  
  // OpenStreetMap Nominatim (무료)
  // 주의: 너무 잦은 호출은 제한될 수 있으니 버튼 클릭 방식으로 사용
  export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
    const q = query.trim();
    if (q.length < 2) return null;
  
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q=" +
      encodeURIComponent(q);
  
    const res = await fetch(url, {
      headers: {
        // Nominatim 권장 헤더 (브라우저 환경에서 User-Agent 직접 설정은 불가)
        "Accept": "application/json",
      },
    });
  
    if (!res.ok) return null;
  
    const data = (await res.json()) as any[];
    if (!Array.isArray(data) || data.length === 0) return null;
  
    const item = data[0];
    const lat = Number(item.lat);
    const lng = Number(item.lon);
  
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  
    return {
      lat,
      lng,
      displayName: String(item.display_name ?? ""),
    };
  }
  