using UnityEditor;

public abstract class GenericEditor : Editor {

    public override void OnInspectorGUI () {
        serializedObject.Update();
        DrawBeforeInspector();
        var currentProperty = serializedObject.GetIterator();
        currentProperty.NextVisible(true);                                                  // necessary to initialize iterator
        using (new EditorGUI.DisabledScope(true))
            EditorGUILayout.PropertyField(currentProperty);                                 // script reference
        DrawAfterScriptField();
        while(currentProperty.NextVisible(false)){                                          // all properties
            if(!DrawPropertyCustom(currentProperty)){
                EditorGUILayout.PropertyField(currentProperty, true);
            }
        }
        DrawAfterInspector();
        serializedObject.ApplyModifiedProperties();
        DrawAfterAllSerializedThingsApplied();
    }

    protected virtual void DrawBeforeInspector () { }

    protected virtual void DrawAfterScriptField () { }

    protected abstract bool DrawPropertyCustom (SerializedProperty property);

    protected virtual void DrawAfterInspector () { }

    protected virtual void DrawAfterAllSerializedThingsApplied () { }

}

public abstract class GenericEditor<T> : GenericEditor where T : UnityEngine.Object {

    public new T target => (T)(base.target);

}
