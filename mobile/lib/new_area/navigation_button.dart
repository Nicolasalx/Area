import 'package:flutter/material.dart';

class NavigationButtons extends StatelessWidget {
  final VoidCallback onBack;
  final VoidCallback? onNext;
  final bool showNext;
  final bool submitting;
  final VoidCallback? onSubmit;
  final bool isNextEnabled;

  const NavigationButtons({
    super.key,
    required this.onBack,
    this.onNext,
    this.showNext = true,
    this.submitting = false,
    this.onSubmit,
    this.isNextEnabled = true,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        TextButton.icon(
          onPressed: onBack,
          icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
          label: const Text('Back'),
          style: TextButton.styleFrom(
            foregroundColor: Colors.grey[700],
            backgroundColor: Colors.grey[100],
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
          ),
        ),
        if (showNext)
          ElevatedButton.icon(
            onPressed: isNextEnabled ? onNext : null,
            icon: const Text('Next'),
            label: Icon(Icons.arrow_forward, color: isNextEnabled ? Colors.white : Colors.grey[500]),
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: isNextEnabled ? Colors.black : Colors.grey[300],
              disabledForegroundColor: Colors.grey[500],
              disabledBackgroundColor: Colors.grey[300],
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          )
        else
          ElevatedButton(
            onPressed: submitting ? null : onSubmit,
            style: ElevatedButton.styleFrom(
              foregroundColor: Colors.white,
              backgroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 12,
              ),
            ),
            child: submitting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Text('Create Area'),
          ),
      ],
    );
  }
}
