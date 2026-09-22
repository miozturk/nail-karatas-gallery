# SvgHotspotLayer — IMP-005

SceneStage `interaction` alanında kullanılır; SVG viewBox değeri `0 0 1920 1440`.
Sahnenin ortak dönüşümüyle ölçeklenir, ayrı bir ölçüm veya geometri değiştirmez.

`SvgHotspot`: `id`, domain `Polygon` tipindeki `points`, erişilebilir `label`,
isteğe bağlı `disabled`. Unit/Block verisine veya yönlendirmeye bağımlı değildir.

Props: grup adı `label`, `hotspots`, kontrollü `hoveredId` ve `activeId`,
isteğe bağlı `onHover(id)` / `onLeave(id)`, `onFocus(id)` / `onBlur(id)` ve zorunlu `onActivate(id)`.
Parent hover ve seçim durumunu yönetir. Klavye odağı ayrı focus-visible stili kullanır.
Enter basıldığında, Space bırakıldığında etkinleşir; tekrar eden keydown yok sayılır.
Space sırasında odağın kaybolması bekleyen aktivasyonu iptal eder.
Disabled poligon Tab sırasına girmez ve callback ile aktive edilemez.
Boş SVG alanı ve disabled bölge pointer olaylarını alttaki katmana geçirir.

Geçici `SceneStageProof` örneği IMP-030 legacy audit sırasında kaldırılmıştır.
Production Home ve Block sahneleri canonical Masterplan ve Unit polygonlarını kullanır.
