import 'package:flutter/material.dart';

class WorkflowStepper extends StatelessWidget {
  final String currentStep;

  const WorkflowStepper({
    super.key,
    required this.currentStep,
  });

  bool isStepActive(String stepKey) {
    if (stepKey == 'trigger-service') {
      return currentStep.startsWith('trigger-');
    } else if (stepKey == 'reaction-service') {
      return currentStep.startsWith('reaction-');
    }
    return currentStep == stepKey;
  }

  bool isStepComplete(String stepKey) {
    if (stepKey == 'trigger-service') {
      return currentStep.startsWith('reaction-') || currentStep == 'name';
    } else if (stepKey == 'reaction-service') {
      return currentStep == 'name';
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final steps = [
      {'key': 'trigger-service', 'label': 'Action'},
      {'key': 'reaction-service', 'label': 'Reaction'},
      {'key': 'name', 'label': 'Name'}
    ];

    return Center(
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: steps.map((step) {
            final isActive = isStepActive(step['key']!);
            final isCompleted = isStepComplete(step['key']!);
            final color = isActive || isCompleted ? Colors.black : Colors.grey;

            return Expanded(
              child: Column(
                children: [
                  Text(
                    step['label']!,
                    style: TextStyle(
                      fontSize: 12,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 60,
                    height: 4,
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
