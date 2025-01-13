import 'package:flutter/material.dart';

class BaseTextField extends StatelessWidget {
  final String label;
  final String? helperText;
  final TextEditingController controller;
  final ValueChanged<String>? onChanged;
  final bool readOnly;
  final VoidCallback? onTap;

  const BaseTextField({
    super.key,
    required this.label,
    this.helperText,
    required this.controller,
    this.onChanged,
    this.readOnly = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        labelText: label,
        helperText: helperText,
        border: const OutlineInputBorder(),
      ),
      controller: controller,
      onChanged: onChanged,
      readOnly: readOnly,
      onTap: onTap,
    );
  }
}

class CustomDateField extends StatelessWidget {
  final String label;
  final String? helperText;
  final TextEditingController controller;
  final Function(DateTime) onDateSelected;

  const CustomDateField({
    super.key,
    required this.label,
    this.helperText,
    required this.controller,
    required this.onDateSelected,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        labelText: label,
        helperText: helperText,
        border: const OutlineInputBorder(),
      ),
      readOnly: true,
      controller: controller,
      onTap: () async {
        final now = DateTime.now();
        final date = await showDatePicker(
          context: context,
          initialDate: now,
          firstDate: now,
          lastDate: DateTime(now.year + 1),
        );
        if (date != null) {
          onDateSelected(date);
        }
      },
    );
  }
}

class CustomTimeField extends StatelessWidget {
  final String label;
  final String? helperText;
  final TextEditingController controller;
  final Function(TimeOfDay) onTimeSelected;

  const CustomTimeField({
    super.key,
    required this.label,
    this.helperText,
    required this.controller,
    required this.onTimeSelected,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        labelText: label,
        helperText: helperText,
        border: const OutlineInputBorder(),
      ),
      readOnly: true,
      controller: controller,
      onTap: () async {
        final time = await showTimePicker(
          context: context,
          initialTime: TimeOfDay.now(),
        );
        if (time != null) {
          onTimeSelected(time);
        }
      },
    );
  }
}
