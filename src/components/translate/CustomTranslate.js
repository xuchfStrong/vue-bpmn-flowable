import TranslationsChinese from './TranslationsChinese'
export default function (template, replacements) {
  replacements = replacements || {};
  template = TranslationsChinese[template] || template;
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
