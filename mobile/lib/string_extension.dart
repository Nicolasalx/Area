extension StringExtension on String {
  String format() {
    if (isEmpty) return this;
    String upper = replaceRange(0, 1, this[0].toUpperCase());
    String spaces = upper.replaceAll('_', ' ');
    return spaces;
  }
}
