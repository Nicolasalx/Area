import 'package:flutter/material.dart';

class IngredientsAccordion extends StatefulWidget {
  final List<Map<String, String>> ingredients;

  const IngredientsAccordion({
    super.key,
    required this.ingredients,
  });

  @override
  State<IngredientsAccordion> createState() => _IngredientsAccordionState();
}

class _IngredientsAccordionState extends State<IngredientsAccordion> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        title: Row(
          children: [
            Icon(Icons.code, size: 20, color: Colors.black),
            const SizedBox(width: 8),
            const Text('Available Ingredients',
                style: TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: widget.ingredients.map((ingredient) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: SelectableText(
                          '{{${ingredient['field']}}}',
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 14,
                            color: Colors.black,
                          ),
                        ),
                      ),
                      if (ingredient['description'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          ingredient['description']!,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
