export const toValidCssClassName = (string) => {
    return string.trim()
        .replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '')
        .replace(/\s/g, '-')
        .toLowerCase();
}
