Proje Özeti: NotLab
NotLab, öğretim ve öğrenim süreçlerini dijital ortamda yönetmek için tasarlanmış bir platformdur. Hem mobil (Flutter) hem de web (Next.js) uygulamalarını kapsayan bu platform, kullanıcılarına interaktif bir öğrenme deneyimi sunar. Proje, farklı kullanıcı rollerine (öğrenci, öğretmen, admin) yönelik çeşitli özellikler içerir ve ölçeklenebilir bir altyapıya sahiptir.

Ana Özellikler ve İşlevsellik
Kullanıcı Rolleri:

Öğrenci: Derslere katılabilir, başarıları takip edebilir, öğretmenlerle etkileşimde bulunabilir.
Öğretmen: Öğrenci grupları oluşturabilir, ders materyalleri paylaşabilir, öğrenci başarılarını takip edebilir.
Admin: Sistem genelindeki yönetimsel işlemleri gerçekleştirebilir (kullanıcı yönetimi, içerik denetimi, raporlama vb.).
Grup Oluşumu ve Yönetimi:

Öğretmenler, öğrenciler için gruplar (sınıflar) oluşturabilir ve bu gruplara ders içerikleri (linkler, materyaller vb.) paylaşabilir.
Öğrenciler, öğretmenlerin paylaştığı linklerle grup veya sınıflara katılabilir.
Ders Yapısı ve Paylaşım:

Bazı dersler (örneğin, Matematik, Türkçe) çoğu sınıfta ortak olacak şekilde belirlenebilir. Bu, her sınıf için ayrı ayrı ders kaydı oluşturmaktan kaçınarak daha verimli bir sistem sağlar.
Dersler ve materyaller merkezi bir yapıda yönetilir, böylece tekrar eden veri girişinden kaçınılır.
Başarı ve Takip:

Öğrencilerin ilerlemeleri ve başarıları izlenebilir. Başarılar, belirli görevlerin veya derslerin tamamlanması gibi çeşitli ölçütlere dayanarak verilir.
Başarılar dinamik ölçütlere göre belirlenebilir. Örneğin, "Bir dersin %80'ini tamamlama" gibi.
Başarılar, her kullanıcının performansına göre kaydedilir ve takip edilir.
Ölçeklenebilirlik ve Esneklik:

Supabase ile desteklenen veritabanı, kullanıcı sayısının artışıyla birlikte ölçeklenebilir.
Proje, gelecekte daha fazla ders, kategori, kullanıcı ve özellik eklenmesine olanak tanıyacak şekilde tasarlanmıştır.
NotLab, sistemde yapılacak herhangi bir büyümeye karşı dayanıklı olacak şekilde yapılandırılmıştır.
Mobil ve Web Platformu:

Mobil (Flutter): Hem Android hem de iOS cihazlar için native özelliklerde performans sunar. Öğrenciler ve öğretmenler, mobil cihazları üzerinden ders içeriklerine erişebilir, gruplara katılabilir ve başarılarını takip edebilirler.
Web (Next.js): Kullanıcılar web tarayıcıları üzerinden sisteme giriş yaparak daha geniş ekran deneyimi ile içeriklere erişebilir. Web platformu, öğretmenlerin derslerini ve başarılarını daha kolay yönetebilmesi için geliştirilmiştir.
Veritabanı Yapısı ve Yönetimi:

Veritabanı Yönetimi: Veritabanı, kullanıcı bilgileri, grup bilgileri, dersler, başarılar ve etkileşimler gibi dinamik verileri yönetmek için optimize edilmiştir.
Veritabanı İlişkileri: Kullanıcılar, başarılar, dersler ve gruplar arasında doğru ilişkiler kurulmuş, ölçeklenebilir bir yapıda veri yönetimi sağlanmıştır.
Gelecek Gelişmeleri ve Entegrasyonlar:

Sistemde yeni ders kategorileri, başarı türleri, kullanıcı özellikleri eklenmesi için altyapı hazırlanmıştır.
Üçüncü parti sistemlerle entegrasyon için modüler yapı sağlanmıştır (API bağlantıları, ödeme sistemleri vb.).
Teknolojik Altyapı:
Frontend (Mobil): Flutter (iOS ve Android için)
Frontend (Web): Next.js (React tabanlı)
Backend: Supabase (veritabanı yönetimi, kimlik doğrulama, API)
Veritabanı: Relational database (Supabase ile yönetilen PostgreSQL)
Kullanıcı Akışları:
Öğrenciler sisteme giriş yaparak mevcut derslere katılır, ders içeriklerini görüntüler ve başarılarını takip eder.
Öğretmenler öğrencilere yönelik gruplar oluşturur, ders materyallerini paylaşır ve öğrencilerin başarılarını izler.
Adminler tüm kullanıcı aktivitelerini yönetir, raporlama yapar ve platformda genel denetimi sağlar.
Ölçeklenebilirlik:
Veritabanı Yönetimi: Supabase, veritabanı işlemlerini optimize ederek büyük kullanıcı ve veri setleriyle çalışabilecek kapasitededir.
API ve Microservice Altyapısı: API tabanlı altyapı, gelecekte modüler bir yapı kurarak başka uygulama ve servislerin kolayca entegrasyonunu sağlar.
Gelecekteki Planlar:
Yeni Ders ve Modüller: Yeni derslerin ve modüllerin sisteme entegre edilmesi.
Yeni Başarı Tipleri ve Kategoriler: Öğrencilerin daha farklı başarı türlerine göre ödüllendirilmesi.
Global Kullanıcı Desteği: Farklı dillerde destek sunma, kullanıcı arayüzü çevirileri.
