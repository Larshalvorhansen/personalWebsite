#!/usr/bin/env python3
"""
Script to insert Brevo tracking code into all HTML files in a folder.
This script will add the Brevo tracker to the <head> section of each HTML file.
"""

import os
import re
import glob
from pathlib import Path

# Brevo tracking code to insert
BREVO_TRACKER = """<script src="https://cdn.brevo.com/js/sdk-loader.js" async></script>
<script>
    // Version: 2.0
    window.Brevo = window.Brevo || [];
    Brevo.push([
        "init",
        {
        client_key: "uej1tbfoc6wlx6kk5ev5over"
        }
    ]);
</script>"""


def has_brevo_tracker(content):
    """Check if the file already contains Brevo tracking code."""
    return "sdk-loader.js" in content or "uej1tbfoc6wlx6kk5ev5over" in content


def insert_brevo_tracker(html_content):
    """Insert Brevo tracker into the <head> section of HTML content."""

    # Check if tracker already exists
    if has_brevo_tracker(html_content):
        print("  ⚠️  Brevo tracker already exists, skipping...")
        return html_content, False

    # Find the <head> tag and insert tracker before closing </head>
    head_pattern = r"(</head>)"

    if re.search(head_pattern, html_content, re.IGNORECASE):
        # Insert before closing </head> tag
        modified_content = re.sub(
            head_pattern, f"\n{BREVO_TRACKER}\n\\1", html_content, flags=re.IGNORECASE
        )
        return modified_content, True
    else:
        print("  ❌ No <head> section found, skipping...")
        return html_content, False


def process_html_files(folder_path="."):
    """Process all HTML files in the specified folder."""

    # Convert to Path object for easier handling
    folder = Path(folder_path)

    if not folder.exists():
        print(f"❌ Folder '{folder_path}' does not exist!")
        return

    # Find all HTML files
    html_files = list(folder.glob("*.html")) + list(folder.glob("*.htm"))

    if not html_files:
        print("❌ No HTML files found in the specified folder!")
        return

    print(f"📁 Processing {len(html_files)} HTML files in '{folder_path}'...")
    print("-" * 50)

    modified_count = 0

    for html_file in html_files:
        print(f"📄 Processing: {html_file.name}")

        try:
            # Read the file
            with open(html_file, "r", encoding="utf-8") as f:
                content = f.read()

            # Insert tracker
            modified_content, was_modified = insert_brevo_tracker(content)

            if was_modified:
                # Create backup
                backup_file = html_file.with_suffix(".bak")
                with open(backup_file, "w", encoding="utf-8") as f:
                    f.write(content)

                # Write modified content
                with open(html_file, "w", encoding="utf-8") as f:
                    f.write(modified_content)

                print(f"  ✅ Tracker added! Backup saved as {backup_file.name}")
                modified_count += 1

        except Exception as e:
            print(f"  ❌ Error processing {html_file.name}: {str(e)}")

    print("-" * 50)
    print(f"🎉 Completed! Modified {modified_count} out of {len(html_files)} files.")

    if modified_count > 0:
        print("📋 Summary:")
        print("  • Brevo tracking code added to <head> section")
        print("  • Backup files (.bak) created for modified files")
        print("  • Files with existing trackers were skipped")


def main():
    """Main function with user interaction."""
    print("🚀 Brevo Tracker Insertion Script")
    print("=" * 40)

    # Get folder path from user
    folder_path = input(
        "Enter folder path (press Enter for current directory): "
    ).strip()
    if not folder_path:
        folder_path = "."

    # Confirm before proceeding
    print(f"\n📍 Target folder: {os.path.abspath(folder_path)}")
    confirm = input("Do you want to proceed? (y/N): ").strip().lower()

    if confirm in ["y", "yes"]:
        print()
        process_html_files(folder_path)
    else:
        print("❌ Operation cancelled.")


if __name__ == "__main__":
    main()
