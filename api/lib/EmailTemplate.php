<?php
declare(strict_types=1);

/**
 * Renders the shared HTML notification email used by every endpoint.
 */
final class EmailTemplate
{
    /**
     * @param string $heading  e.g. "NEW CONNECTION"
     * @param array<int, array{label:string, value:string, mono?:bool}> $fields
     */
    public static function render(string $heading, array $fields, string $footer = ''): string
    {
        $rows = '';
        foreach ($fields as $field) {
            $label = htmlspecialchars($field['label'], ENT_QUOTES, 'UTF-8');
            $value = $field['value'];
            if (!empty($field['mono'])) {
                $value = '<div class="box">' . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8')) . '</div>';
            } else {
                $value = '<span class="value">' . nl2br(htmlspecialchars($value, ENT_QUOTES, 'UTF-8')) . '</span>';
            }
            $rows .= "<div class=\"field\"><span class=\"label\">$label</span>$value</div>\n";
        }

        $safeHeading = htmlspecialchars($heading, ENT_QUOTES, 'UTF-8');
        $safeFooter  = htmlspecialchars($footer, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,.1); }
  .header { background: #0A0A0A; padding: 20px; text-align: center; border-bottom: 3px solid #C8FF00; }
  .header h2 { color: #fff; margin: 0; font-weight: 600; letter-spacing: 1px; }
  .content { padding: 30px; }
  .field { margin-bottom: 15px; }
  .label { font-size: 12px; text-transform: uppercase; color: #888; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; display: block; }
  .value { font-size: 16px; color: #111; }
  .box { background: #f9f9f9; border: 1px solid #eee; padding: 15px; border-radius: 6px; margin-top: 10px; font-size: 15px; white-space: normal; word-break: break-word; }
  .footer { background: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
</style>
</head>
<body>
  <div class="container">
    <div class="header"><h2>$safeHeading</h2></div>
    <div class="content">$rows</div>
    <div class="footer">$safeFooter</div>
  </div>
</body>
</html>
HTML;
    }
}
