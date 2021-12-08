<div class="api">

    # <span class="api-name"><tmpl:md content="node.attributes['id']"/></span>

    <tmpl:if test="node.children['tag']">
        <tmpl:map list="node.children['tag']">
            <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

    <div class="api-text">
        <tmpl:map list="node.children['text']">
            <tmpl:md content="item.contents"/>
        </tmpl:map>
    </div>

    <tmpl:if test="node.children['alias'].length > 0">
        ## 其它名称和入口
        <tmpl:map list="node.children['alias']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

    <tmpl:if test="node.children['call'].length > 0">
        ## 调用方法
        <tmpl:map list="node.children['call']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

    <tmpl:if test="node.children['parameter'].length > 0">
        ## 参数介绍
        <tmpl:map list="node.children['parameter']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

    <tmpl:if test="node.children['result'].length > 0">
        ## 返回内容
        <tmpl:map list="node.children['result']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

    <div class="api-sources">
        ## 源文件
        <tmpl:map list="node.children['source']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </div>

    <tmpl:if test="node.children['related'].length > 0">
        ## 关联API
        <tmpl:map list="node.children['related']">
            * <tmpl:md content="item.contents"/>
        </tmpl:map>
    </tmpl:if>

</div>
