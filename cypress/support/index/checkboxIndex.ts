interface CheckboxItem {
  index: number;
  name: string;
  initialChecked: boolean;
}

interface CheckboxData {
  path: string;
  checkboxes: CheckboxItem[];
}