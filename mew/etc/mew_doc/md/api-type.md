<span class="api-type">
    <tmpl:if test="node.attributes.type == 'value'">
        <span class="api-type-name api-type-value"><tmpl:md content="node.children['name'][0].contents"/></span>
    </tmpl:if>
    <tmpl:if test="node.attributes.type == 'standard'">
        <span class="api-type-name"><tmpl:md content="node.children['name'][0].contents"/></span>
    </tmpl:if>
    <tmpl:if test="node.attributes.type == 'array'">
        <span class="api-type-operator">\[</span>
        <tmpl:map list="node.children['parameter']">
            <tmpl:md content="item.contents"/>
            <tmpl:if test="index < list.length - 1"><span class="api-type-operator">,&nbsp;</span></tmpl:if>
        </tmpl:map>
        <tmpl:if test="node.children['varying']">
            <span class="api-type-operator">&nbsp;...</span>
        </tmpl:if>
        <span class="api-type-operator">\]</span>
    </tmpl:if>
    <tmpl:if test="node.attributes.type == 'object'">
        <span class="api-type-operator">\{</span>
        <tmpl:map list="node.children['parameter']">
            <tmpl:md content="item.contents"/>
            <tmpl:if test="index < list.length - 1"><span class="api-type-operator">,&nbsp;</span></tmpl:if>
        </tmpl:map>
        <span class="api-type-operator">\}</span>
    </tmpl:if>
    <tmpl:if test="node.attributes.type == 'generic'">
        <span class="api-type-name"><tmpl:md content="node.children['name'][0].contents"/></span>
        <span class="api-type-operator">&lt;</span>
        <tmpl:map list="node.children['parameter']">
            <tmpl:md content="item.contents"/>
            <tmpl:if test="index < list.length - 1"><span class="api-type-operator">,&nbsp;</span></tmpl:if>
        </tmpl:map>
        <tmpl:if test="node.children['varying']">
            <span class="api-type-operator">&nbsp;...</span>
        </tmpl:if>
        <span class="api-type-operator">&gt;</span>
    </tmpl:if>
    <tmpl:if test="node.attributes.type == 'function'">
        <span class="api-type-operator">(</span>
        <tmpl:if test="node.children['argument']">
            <tmpl:map list="node.children['argument']">
                <tmpl:md content="item.contents"/>
                <tmpl:if test="index < list.length - 1"><span class="api-type-operator">,&nbsp;</span></tmpl:if>
            </tmpl:map>
        </tmpl:if>
        <tmpl:if test="node.children['varying']">
            <span class="api-type-operator">&nbsp;...</span>
        </tmpl:if>
        <span class="api-type-operator">) -&gt; </span>
        <span class="api-type-result"><tmpl:md content="node.children['result'][0].contents"/></span>
    </tmpl:if>
</span>
