/** Props every label-manager Home widget receives — mirrors `DashboardWidgetProps`
 *  on the producer side, but scoped by label id instead of a track list, since
 *  each widget derives its own data from the label-manager mocks. */
export interface LabelWidgetProps {
  activeLabelId: string;
}
