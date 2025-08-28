package com.auth_service.service;

public final class EmailTemplates {

    private EmailTemplates() {}

    public static String welcome(String name) {
        String safeName = name == null || name.isBlank() ? "" : name.trim();
        return base(
                "Hesabın Başarıyla Oluşturuldu",
                "Merhaba %s,".formatted(escape(safeName)),
                "E-Ticaret hesabın başarıyla oluşturuldu. Güvenli alışverişin keyfini çıkar!",
                "Hesabına Git",
                "http://localhost:3000"
        );
    }

    public static String passwordChanged(String name) {
        String safeName = name == null || name.isBlank() ? "" : name.trim();
        return base(
                "Şifren Güncellendi",
                "Merhaba %s,".formatted(escape(safeName)),
                "Hesabının şifresi az önce değiştirildi. Bu işlemi sen yapmadıysan lütfen hemen bizimle iletişime geç ve şifreni sıfırla.",
                "Şifreyi Yönet",
                "http://localhost:3000"
        );
    }

    public static String addressSaved(String name, String city, String street) {
        String safeName = name == null || name.isBlank() ? "" : name.trim();
        String location = String.join(", ", new String[]{nullToEmpty(street), nullToEmpty(city)}).replaceAll(", $", "");
        return base(
                "Adresin Kaydedildi",
                "Merhaba %s,".formatted(escape(safeName)),
                "Yeni teslimat adresin kaydedildi: %s".formatted(escape(location)),
                "Adresleri Gör",
                "http://localhost:3000"
        );
    }

    private static String escape(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    private static String base(String title, String greeting, String message, String ctaText, String ctaHref) {
        return """
<!DOCTYPE html>
<html lang=\"tr\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>%s</title>
  <style>
    body { background:#f6f9fc; margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; }
    .container { max-width: 560px; margin: 24px auto; padding: 0 16px; }
    .card { background:#ffffff; border-radius:12px; box-shadow: 0 6px 24px rgba(0,0,0,0.06); overflow:hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; padding: 24px; }
    .header h1 { margin: 0; font-size: 20px; }
    .content { padding: 24px; color:#0f172a; }
    .content p { line-height: 1.6; margin: 0 0 16px 0; }
    .cta { display:inline-block; background:#2563eb; color:#fff !important; text-decoration:none; padding: 12px 18px; border-radius:10px; font-weight:600; }
    .footer { color:#64748b; font-size:12px; padding: 16px 24px 24px; }
    .divider { height:1px; background:#e2e8f0; margin: 16px 0; }
  </style>
</head>
<body>
  <div class=\"container\">
    <div class=\"card\">
      <div class=\"header\">
        <h1>%s</h1>
      </div>
      <div class=\"content\">
        <p>%s</p>
        <p>%s</p>
        <p style=\"margin:24px 0\"><a class=\"cta\" href=\"%s\" target=\"_blank\" rel=\"noopener noreferrer\">%s</a></p>
        <div class=\"divider\"></div>
        <p style=\"color:#64748b\">Bu e-posta otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
      </div>
      <div class=\"footer\">
        <div><strong>E‑Ticaret Marketplace</strong></div>
        <div>© %s</div>
      </div>
    </div>
  </div>
</body>
</html>
""".formatted(
                title,
                title,
                greeting,
                message,
                ctaHref,
                ctaText,
                java.time.Year.now()
        );
    }
}


